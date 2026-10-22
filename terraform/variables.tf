variable "aws_region" {
  type    = string
  default = "ap-south-1"
}
variable "aws_profile" {
  type    = string
  default = "chatr"
}

variable "cluster_name" {
  type    = string
  default = "chatr"
}

variable "node_instance_type" {
  type    = string
  default = "t3.small"
}
variable "kubernetes_version" {
  type        = string
  description = "kubernetes version for eks cluster"
  default     = "1.36"
}
variable "vpc_cidr" {
  default = "10.0.0.0/16"
}
variable "private_subnet_cidr" {
  type        = list(string)
  description = "cidr blocks for the private subnets, one per AZ"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}
variable "public_subnet_cidr" {
  type        = list(string)
  description = "cidr blocks for the public subnets, one per AZ"
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}
variable "node_min_size" {
  type        = number
  description = "minimum nodes in the cluster"
  default     = 1
}
variable "node_desired_size" {
  type        = number
  description = "desired nodes in the cluster"
  default     = 2
}
variable "node_max_size" {
  type        = number
  description = "maximum nodes in the managed group"
  default     = 2
}
variable "environment" {
  type        = string
  description = "env variables for the services"
  default     = "lab"
}
