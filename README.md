# AgroLink

Geo-bilinçli, Kubernetes-native bir agronomi deneyimi. Bu repo; statik UI, GitLab pipeline şablonu, container imajı ve ABD/Avrupa bölgeleri için ingress önerileri içerir.

## Geliştirme

```bash
npm install
npm run lint
npm run build
```
`dist/` klasörü Docker imajına kopyalanır.

## GitLab CI/CD

`.gitlab-ci.yml` dosyası şu aşamaları içerir:
- **lint**: ESLint ile statik analiz.
- **build**: Statik dosyaların üretimi.
- **docker-build**: `Dockerfile` ile imaj oluşturur ve `CI_REGISTRY_IMAGE` adresine push eder.
- **security**: GitLab SAST template’i ile kod taraması.

Temel değişkenler:
- `CI_REGISTRY_USER`, `CI_REGISTRY_PASSWORD`: Container registry kimliği.
- `KUBE_CONFIG_US`, `KUBE_CONFIG_EU`: Base64 encode kubeconfig içerikleri.
- `CI_APPLICATION_TAG`: Deploy edilen imaj tag’i.

## Kubernetes & Ingress (ABD / Avrupa)

`k8s/` dizini geo bölgeli manifest örnekleri sunar:
- `deployment.yaml`: Nginx tabanlı statik site ve readiness propları.
- `service.yaml`: ClusterIP servis.
- `ingress-us.yaml` / `ingress-eu.yaml`: Bölgeye özel host ve anotasyonlar.

Önerilen ingress anotasyonları:
- `nginx.ingress.kubernetes.io/canary-weight`: Canary yüzdesi (10 → 50 → 100).
- `nginx.ingress.kubernetes.io/affinity: cookie`: Bölgesel yapışkanlık.
- `nginx.ingress.kubernetes.io/geo-country-code`: Geo yönlendirme için özel header.

ABD/EU bölgesini uygulamak için:
1. `ingress-us.yaml` ve `ingress-eu.yaml` dosyalarını domain’lerinize göre güncelleyin.
2. GitLab deploy job’unda uygun kubeconfig’i seçin (örnek `.gitlab-ci.yml` içindeki `KUBE_CONTEXT` değişkeni).
3. Canary ağırlıklarını kademeli artırın, gözlem için `kubectl describe ingress` ve `kubectl logs -n ingress-nginx` kullanın.

## Güvenlik ve kalite
- ESLint ile kod kalitesi.
- GitLab SAST include’u.
- Signed container image için GitLab Container Registry + cosign entegrasyonu için `docker-build` job’ını genişletebilirsiniz.
- Runtime’da mTLS ve WAF için ingress anotasyonlarını `ingress-*.yaml` dosyasında geliştirin.

## Yerel önizleme
`dist/` klasörünü üretip bir static server ile çalıştırabilirsiniz:

```bash
npm install
npm run build
npx serve dist
```

