import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { getDynamoDbClient } from "./client";

export interface GetFromDynamoArgs {
  tableName: string;
  key: string;
}

export async function getFromDynamo({ tableName, key }: GetFromDynamoArgs) {
  const client = getDynamoDbClient();

  try {
    const result = await client.send(
      new GetItemCommand({
        TableName: tableName,
        Key: {
          SessionId: { S: key },
        },
      }),
    );

    return result;
  } catch (error) {
    console.error(error);
  }
}
