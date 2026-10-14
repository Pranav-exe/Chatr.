variable "cluster_name" {
  type        = string
  description = "Cluster name, used for the VPC name and subnet tags"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
}

variable "private_subnet_cidr" {
  type        = list(string)
  description = "CIDR blocks for the private subnets, one per AZ"
}

variable "public_subnet_cidr" {
  type        = list(string)
  description = "CIDR blocks for the public subnets, one per AZ"
}
