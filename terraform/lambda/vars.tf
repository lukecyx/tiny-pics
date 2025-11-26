variable "project" {
  description = "the name of the project"
  type        = string
  default     = "tiny-pics"
}


variable "iam_role_arn" {
  description = "IAM role arn for resizing image func"
  type        = string
}


variable "s3_uploaded_bucket_arn" {
  description = "the arn of the s3 uploaded bucket"
  type        = string
}

variable "region" {
  type = string
}
