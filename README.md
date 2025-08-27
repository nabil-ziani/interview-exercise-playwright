# interview-exercise-playwright

> De opdracht staat beschreven in [assets/docs/Assignment.md](./assets/docs/Assignment.md)

> Mijn strategie staat beschreven in [assets/docs/Strategy.md](./assets/docs/Strategy.md)

## 🚀 Installatie

### Vereisten
- Node.js
- npm of yarn


### Stappen 
```bash
# 1. Clone de repository
git clone <jouw-repo-url>
cd interview-exercise-playwright

# 2. Installeer dependencies
npm install

# 3. Installeer Playwright browsers
npm run install:browsers
```

## 🧪 Tests Uitvoeren

### Alle tests
```bash
npm test
```

### Tests met UI (voor debugging)
```bash
npm run test:ui
```

### Tests in headed mode
```bash
npm run test:headed
```

### Specifieke test
```bash
npx playwright test tests/assigment.spec.ts
```


## 🔧 Additionele informatie

### CI/CD

Ik heb de pipeline opgezet, maar merkte dat mijn tests faalden omdat bol.com de requests blokkeerde. Ik weet niet hoe ik dit moet omzeilen en ook niet of het toegestaan zou zijn aangezien het om een productie-omgeving gaat. Ik ben hier daarom bewust terughoudend in geweest en heb dit onderdeel beperkt gehouden tot het opzetten van de pipeline.

![screenshot](/assets/images/blocked-ip.png)