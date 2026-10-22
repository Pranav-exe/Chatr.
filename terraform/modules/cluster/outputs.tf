output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_name
}

output "oidc_provider_arn" {
  description = "ARN of the cluster's OIDC provider, used for IAM roles for service accounts"
  value       = module.eks.oidc_provider_arn
}
