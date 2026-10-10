output "cluster_name" {
  value = module.eks.cluster_name
}

output "oidc_provider_arn" {
  value = module.eks.oidc_provider_arn
}

output "configure_kubectl" {
  value = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}