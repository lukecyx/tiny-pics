variable "region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "eu-west-1"
}

variable "project" {
  description = "the name of the project"
  type        = string
  default     = "tiny-pics"
}
