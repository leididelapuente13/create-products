variable "region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "us-west-1"
}

variable "lambda_bucket" {
  description = "S3 bucket for Lambda deployment packages"
  type        = string
}

variable "product_table_name" {
  description = "Name of the DynamoDB table for products"
  type        = string
  default     = "Products"
}

variable "auth_api_url" {
  description = "URL of the internal Auth API for token validation"
  type        = string
}
