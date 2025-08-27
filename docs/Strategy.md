# Hier leg je kort uit hoe je de tests hebt opgezet, welke risico’s je zag, en hoe je flaky tests vermeden hebt.
# Mijn strategie

Ik heb de testen gebaseerd op de 4 scenarios van de assignment:

## 1. Homepage en zoekfunctie
Mijn eerste uitdaging bij het schrijven van deze test was het vinden van een geschikte selector om na te gaan of er resultaten zijn. Initieel dacht ik vrij simpel `product-cards` te kunnen ophalen en vanuit die locator details te kunnen opvragen (`product-title`, `product-price`), maar dit was niet mogelijk aangezien ieder product in meerdere <div>-elementen zat zonder attributen en xpaths wou ik zoveel mogelijk vermijden.  

Ik besloot vervolgens de product-titels op te halen en op basis daarvan na te gaan of er resultaten zijn, dat moet wel lukken, want het zijn de enige <h2>-elementen op de pagina. Ik haalde deze op met de volgende selector:
```ts
page.getByRole('heading', { level: 2 });
```  
Dit gaf mij nog andere elementen en niet enkel de product-titels, vanwege het feit dat er in de html-code elementen zaten die er alsvolgt uitzien:
```html
<span role="heading" aria-level="2">...</span> 
``` 
Deze werden met de vorige selector ook inbegrepen en om dat te vermijden heb ik de volgende selector gebruikt:
```ts
page.locator('h2').all();
```
Dit geeft mij enkel de product-titels en zo ben ik zeker dat bij het slagen van de test er effectief producten zichtbaar waren.

## 2. Filteren en sorteren

## 3. Productdetail-pagina (PDP)

## 4. Paginering 

