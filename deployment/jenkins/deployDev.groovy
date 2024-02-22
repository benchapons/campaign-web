library 'spwretailautomation-jenkins-library'
deployNewLZHarbor(
  commitTagBranch: "main",
  label:"dev",
  cceURL:"CCE-LANDING-DEV-URL",
  cceId:"CCE-LANDING-DEV-CREDENTIAL",
  registryDomain: "harbor-dev.onesiam.com",
  registryURL: "https://harbor-dev.onesiam.com",
  imagePullSecrets:"habor-dev-registry",
  imageName:"cx/campaign/campaign-management-web",
  appName:"campaign-management-web",
  nameSpace:"customer-experience",
  deploymentFile:"deployment/kubernetes/kubernetes-nonprod.yaml",
  configMapName:"campaign-management-web-dev",
  kubeSecretName:"campaign-management-web-dev"
)