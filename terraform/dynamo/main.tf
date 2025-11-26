resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = "Sessions"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "SessionId"

  attribute {
    name = "SessionId"
    type = "S"
  }

  tags = {
    Name        = "tiny-pics-sessions"
    Environment = "dev"
  }
}
