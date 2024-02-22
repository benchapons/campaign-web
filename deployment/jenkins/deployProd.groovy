library 'spwretailautomation-jenkins-library'
deployNewLZHarborTag(
  label:"slave-prod",
  cceId:"CCE-LANDING-PROD-CREDENTIAL",
  cceURL:"CCE-LANDING-PROD-URL",
  registryDomain: "harbor.onesiam.com",
  registryURL: "https://harbor.onesiam.com",
  imagePullSecrets:"harbor-registry",
  imageName:"cx/campaign/campaign-management-web",
  appName:"campaign-management-web",
  nameSpace:"customer-experience",
  deploymentFile:"deployment/kubernetes/kubernetes-prod.yaml",
  configMapName:"campaign-management-web-prod",
  kubeSecretName:"campaign-management-web-prod"
)