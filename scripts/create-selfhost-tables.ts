import {
  CreateTableCommand,
  DynamoDBClient,
  GlobalSecondaryIndex,
  KeySchemaElement,
  ScalarAttributeType,
  UpdateTimeToLiveCommand,
} from "@aws-sdk/client-dynamodb";

// Creates all DynamoDB tables for a self-hosted deployment (usually against DynamoDB Local).
// Schemas mirror liftosaur-cdk/liftosaur-cdk.ts. Prod table names are used - run the server
// with IS_DEV=false so Utils_getEnv() resolves to "prod" and matches these names.
//
// Usage: DYNAMODB_ENDPOINT=http://localhost:8000 ts-node scripts/create-selfhost-tables.ts

type IKeyDef = { name: string; type: ScalarAttributeType };

interface ITableDef {
  name: string;
  partitionKey: IKeyDef;
  sortKey?: IKeyDef;
  ttlAttribute?: string;
  gsis?: { indexName: string; partitionKey: IKeyDef; sortKey?: IKeyDef }[];
}

const tables: ITableDef[] = [
  {
    name: "lftUsers",
    partitionKey: { name: "id", type: "S" },
    gsis: [
      { indexName: "lftUsersGoogleId", partitionKey: { name: "googleId", type: "S" } },
      { indexName: "lftUsersAppleId", partitionKey: { name: "appleId", type: "S" } },
      { indexName: "lftUsersEmail", partitionKey: { name: "email", type: "S" } },
      { indexName: "lftUsersNickname", partitionKey: { name: "nickname", type: "S" } },
    ],
  },
  {
    name: "lftAffiliates",
    partitionKey: { name: "affiliateId", type: "S" },
    sortKey: { name: "userId", type: "S" },
    gsis: [{ indexName: "lftAffiliatesUserId", partitionKey: { name: "userId", type: "S" } }],
  },
  {
    name: "lftSubscriptionDetails",
    partitionKey: { name: "userId", type: "S" },
    gsis: [
      {
        indexName: "lftSubscriptionDetailsOriginalTransactionId",
        partitionKey: { name: "originalTransactionId", type: "S" },
      },
    ],
  },
  {
    name: "lftPayments",
    partitionKey: { name: "userId", type: "S" },
    sortKey: { name: "timestamp", type: "N" },
    gsis: [{ indexName: "lftPaymentsTransactionId", partitionKey: { name: "transactionId", type: "S" } }],
  },
  { name: "lftGoogleAuthKeys", partitionKey: { name: "token", type: "S" } },
  { name: "lftAppleAuthKeys", partitionKey: { name: "token", type: "S" } },
  {
    name: "lftHistoryRecords",
    partitionKey: { name: "userId", type: "S" },
    sortKey: { name: "id", type: "N" },
    gsis: [
      {
        indexName: "lftHistoryRecordsDate",
        partitionKey: { name: "userId", type: "S" },
        sortKey: { name: "date", type: "S" },
      },
    ],
  },
  {
    name: "lftStats",
    partitionKey: { name: "userId", type: "S" },
    sortKey: { name: "name", type: "S" },
    gsis: [
      {
        indexName: "lftStatsTimestamp",
        partitionKey: { name: "userId", type: "S" },
        sortKey: { name: "timestamp", type: "N" },
      },
    ],
  },
  {
    name: "lftLogs",
    partitionKey: { name: "userId", type: "S" },
    sortKey: { name: "action", type: "S" },
    gsis: [
      {
        indexName: "lftLogsDate",
        partitionKey: { name: "year", type: "N" },
        sortKey: { name: "month", type: "N" },
      },
    ],
  },
  {
    name: "lftUserPrograms",
    partitionKey: { name: "userId", type: "S" },
    sortKey: { name: "id", type: "S" },
  },
  { name: "lftPrograms", partitionKey: { name: "id", type: "S" } },
  {
    name: "lftUrls",
    partitionKey: { name: "id", type: "S" },
    gsis: [{ indexName: "lftUrlsUserId", partitionKey: { name: "userId", type: "S" } }],
  },
  { name: "lftFreeUsers", partitionKey: { name: "id", type: "S" } },
  { name: "lftCoupons", partitionKey: { name: "code", type: "S" } },
  {
    name: "lftApiKeys",
    partitionKey: { name: "key", type: "S" },
    gsis: [{ indexName: "lftApiKeysUserId", partitionKey: { name: "userId", type: "S" } }],
  },
  { name: "lftOauthClients", partitionKey: { name: "clientId", type: "S" } },
  { name: "lftOauthAuthCodes", partitionKey: { name: "code", type: "S" }, ttlAttribute: "ttl" },
  {
    name: "lftOauthTokens",
    partitionKey: { name: "token", type: "S" },
    ttlAttribute: "ttl",
    gsis: [{ indexName: "lftOauthTokensRefreshToken", partitionKey: { name: "refreshToken", type: "S" } }],
  },
  { name: "lftDebug", partitionKey: { name: "id", type: "S" } },
  {
    name: "lftEvents",
    partitionKey: { name: "userId", type: "S" },
    sortKey: { name: "timestamp", type: "N" },
    ttlAttribute: "ttl",
    gsis: [
      {
        indexName: "lftEventsName",
        partitionKey: { name: "name", type: "S" },
        sortKey: { name: "timestamp", type: "N" },
      },
    ],
  },
  {
    name: "lftAiLogs",
    partitionKey: { name: "id", type: "S" },
    ttlAttribute: "ttl",
    gsis: [
      {
        // the only unsuffixed GSI name in the CDK stack - keep it verbatim
        indexName: "userId-timestamp-index",
        partitionKey: { name: "userId", type: "S" },
        sortKey: { name: "timestamp", type: "N" },
      },
    ],
  },
  { name: "lftAiMuscleCaches", partitionKey: { name: "key", type: "S" } },
];

function keySchema(partitionKey: IKeyDef, sortKey?: IKeyDef): KeySchemaElement[] {
  return [
    { AttributeName: partitionKey.name, KeyType: "HASH" },
    ...(sortKey ? [{ AttributeName: sortKey.name, KeyType: "RANGE" as const }] : []),
  ];
}

async function main(): Promise<void> {
  const endpoint = process.env.DYNAMODB_ENDPOINT;
  if (!endpoint) {
    throw new Error("Set DYNAMODB_ENDPOINT (e.g. http://localhost:8000 for DynamoDB Local)");
  }
  const client = new DynamoDBClient({
    endpoint,
    region: process.env.AWS_REGION || "local",
    credentials: { accessKeyId: "local", secretAccessKey: "local" },
  });

  // Optional: LFT_TABLE_SUFFIX=Dev creates the dev-named tables (used with IS_DEV=true, e.g. for
  // local smoke tests via the forceuseremail login bypass). Real deployments use no suffix.
  const suffix = process.env.LFT_TABLE_SUFFIX || "";
  for (const table of tables) {
    const tableName = `${table.name}${suffix}`;
    const gsiName = (name: string): string => (name === "userId-timestamp-index" ? name : `${name}${suffix}`);
    const attributeNames = new Map<string, ScalarAttributeType>();
    for (const key of [
      table.partitionKey,
      table.sortKey,
      ...(table.gsis || []).flatMap((g) => [g.partitionKey, g.sortKey]),
    ]) {
      if (key) {
        attributeNames.set(key.name, key.type);
      }
    }
    const gsis: GlobalSecondaryIndex[] | undefined = table.gsis?.map((gsi) => ({
      IndexName: gsiName(gsi.indexName),
      KeySchema: keySchema(gsi.partitionKey, gsi.sortKey),
      Projection: { ProjectionType: "ALL" },
    }));
    try {
      await client.send(
        new CreateTableCommand({
          TableName: tableName,
          KeySchema: keySchema(table.partitionKey, table.sortKey),
          AttributeDefinitions: Array.from(attributeNames.entries()).map(([name, type]) => ({
            AttributeName: name,
            AttributeType: type,
          })),
          BillingMode: "PAY_PER_REQUEST",
          GlobalSecondaryIndexes: gsis,
        })
      );
      console.log(`Created ${tableName}`);
    } catch (error) {
      if ((error as Error).name === "ResourceInUseException") {
        console.log(`Exists  ${tableName}`);
        continue;
      }
      throw error;
    }
    if (table.ttlAttribute) {
      try {
        await client.send(
          new UpdateTimeToLiveCommand({
            TableName: tableName,
            TimeToLiveSpecification: { AttributeName: table.ttlAttribute, Enabled: true },
          })
        );
      } catch (error) {
        // DynamoDB Local ignores/partially supports TTL - rows just accumulate, which is harmless
        console.log(`TTL setup skipped for ${tableName}: ${(error as Error).message}`);
      }
    }
  }
  console.log("All tables ready");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
