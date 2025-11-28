resource "aws_s3_bucket" "uploaded" {
  bucket = "${var.project}-uploaded"

  tags = {
    Name        = "${var.project}-uploaded-images"
    Environment = "dev"
  }
}

resource "aws_s3_bucket" "resized" {
  bucket = "${var.project}-resized"

  tags = {
    Name        = "${var.project}-uploaded"
    Environment = "dev"
  }
}

resource "aws_s3_bucket_public_access_block" "uploaded" {
  bucket = aws_s3_bucket.uploaded.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}


resource "aws_s3_bucket_public_access_block" "resized" {
  bucket = aws_s3_bucket.resized.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "uploaded" {
  bucket = aws_s3_bucket.uploaded.id

  rule {
    id     = "expires-1-day"
    status = "Enabled"
    expiration {
      days = 1
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "resized" {
  bucket = aws_s3_bucket.resized.id

  rule {
    id     = "expires-1-day"
    status = "Enabled"
    expiration {
      days = 1
    }
  }
}


resource "aws_s3_bucket_notification" "uploaded_bucket_notif" {
  bucket = aws_s3_bucket.uploaded.id

  lambda_function {
    lambda_function_arn = var.lambda_resizer_func_arn
    events              = ["s3:ObjectCreated:*"]
  }

  depends_on = [var.lambda_resizer_permission_dep]
}
