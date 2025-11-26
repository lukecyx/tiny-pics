output "s3_uploaded_bucket_arn" {
  value = aws_s3_bucket.uploaded.arn
}

output "s3_resized_bucket_arn" {
  value = aws_s3_bucket.resized.arn

}
