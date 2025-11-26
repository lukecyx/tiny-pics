variable "uploaded_bucket_name" {
  description = "s3 bucket name for uploaded images"
  type        = string
}

variable "resized_bucket_name" {
  description = "s3 bucket name for resized images"
  type        = string
}

variable "region" {
  type = string
}

variable "table_name" {
  type = string

}
