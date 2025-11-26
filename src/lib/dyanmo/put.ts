import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { getDynamoDbClient } from "./client";

export interface WriteSessionDataArgs {
  uuid: string;
}

export async function writeSessionData({ uuid }: WriteSessionDataArgs) {
  const client = getDynamoDbClient();
  const params = {
    TableName: process.env.SESSIONS_TABLE_NAME!,
    Item: {
      SessionId: { S: uuid },
      Done: { BOOL: false },
      ResizedKeys: { L: [] },
    },
    ConditionExpression: "attribute_not_exists(SessionId)",
  };

  try {
    await client.send(new PutItemCommand(params));
  } catch (error) {
    console.error("error writing to dyanmo", error);
  }
}
