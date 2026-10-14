variable "cluster_name" {
  type        = string
  description = "Name of the EKS cluster, also used to name the EBS CSI IAM role"
}

variable "kubernetes_version" {
  type        = string
  description = "Kubernetes version for the EKS cluster"
}

variable "node_instance_type" {
  type        = string
  description = "EC2 instance type for the managed node group"
}

variable "node_min_size" {
  type        = number
  description = "Minimum number of nodes in the managed node group"
}

variable "node_desired_size" {
  type        = number
  description = "Desired number of nodes in the managed node group"
}

variable "node_max_size" {
  type        = number
  description = "Maximum number of nodes in the managed node group"
}

variable "vpc_id" {
  type        = string
  description = "ID of the VPC the cluster runs in, from the network module"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "Private subnet IDs for the cluster and nodes, from the network module"
}
