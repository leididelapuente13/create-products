variable "region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "us-west-1"
}

variable "product_table_name" {
  description = "Name of the DynamoDB table for products"
  type        = string
  default     = "Products"
}

