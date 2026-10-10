module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 21.0"

  name               = var.cluster_name
  kubernetes_version = "1.33"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  enable_irsa                              = true
  endpoint_public_access                   = true
  enable_cluster_creator_admin_permissions = true

  addons = {
    coredns    = {}
    kube-proxy = {}

    vpc-cni = {
      before_compute = true
    }

    aws-ebs-csi-driver = {
      service_account_role_arn = module.ebs_csi_irsa.arn
    }
  }

  eks_managed_node_groups = {
    default = {
      instance_types = [var.node_instance_type]

      min_size     = 1
      desired_size = 2
      max_size     = 2
    }
  }
}

module "ebs_csi_irsa" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts"
  version = "~> 6.0"

  name             = "${var.cluster_name}-ebs-csi"
  use_name_prefix  = true
  attach_ebs_csi_policy = true

  oidc_providers = {
    main = {
      provider_arn = module.eks.oidc_provider_arn

      namespace_service_accounts = [
        "kube-system:ebs-csi-controller-sa"
      ]
    }
  }
}