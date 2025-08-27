# Mijn strategie

> Ik heb de testen gebaseerd op de 4 scenarios van de assignment:

## 1. Homepage en zoekfunctie

Mijn eerste uitdaging bij het schrijven van deze test was het vinden van een geschikte selector om na te gaan of er resultaten zijn. Initieel dacht ik vrij simpel `product-cards` te kunnen ophalen en vanuit die locator details te kunnen opvragen (zoals `product-title` en `product-price`), maar dit was niet mogelijk aangezien ieder product in meerdere `<div>`-elementen zaten die dat geen attributen hadden en xpaths wou ik zoveel mogelijk vermijden.  

Ik besloot dan om de product-titels op te halen en op basis daarvan na te gaan of er resultaten zijn, dat moet wel lukken, want het zijn de enige `<h2>`-elementen op de pagina. Ik haalde deze op met de volgende selector:

```ts
page.getByRole('heading', { level: 2 });
```  

Vreemd, dit gaf mij nog andere elementen en niet enkel de product-titels.. In de html-code had je namelijk elementen die er als volgt uitzagen:

```html
<span role="heading" aria-level="2">...</span> 
``` 

Deze werden met de vorige selector ook inbegrepen en om dat te vermijden gebruikte ik de volgende selector:

```ts
page.locator('h2').all();
```

***Dit geeft enkel de product-titels terug en zo kunnen we zeker zijn dat bij het slagen van de test er effectief producten zichtbaar waren.***


## 2. Filteren en sorteren

Nu gaan we verifiëren of er gefilterd en gesorteerd kan worden, laten we beginnen met het ophalen van de categorie-links.

```ts
page.getByRole('link', {name: ... });
```

Het eerste probleem dat ik hierbij zag was het volgende, op de website van bol.com tonen ze niet enkel de categorie maar ook het aantal en dat is een dynamisch gegeven. Ik kon dit dus niet klakkeloos overnemen, want anders zou de test niet betrouwbaar zijn, de oplossing hier was om een regex mee te geven en dus te zeggen: *"geef mij de link waarin het volgende woord voorkomt"*.

Daarna willen we klikken op de knop, maar dat lukte niet altijd en zorgde voor flaky tests, daarom besloot ik hier te kiezen voor `dblclick()`.

De volgende uitdaging was om te verifiëren dat de producten gefilterd zijn, dit kon ik doen a.d.h.v. de breadcrumb, maar de html-structuur maakte het bijzonder lastig om een robuuste selector te vinden. De beste optie die ik hier zag was een simpele xpath.

```ts
this.breadCrumbList = page.locator('//header/following::ul[1]');
```

Volgende stap, de producten sorteren op basis van de prijs en dit verifiëren! Om dit te verifiëren had ik de prijzen nodig en deze haalde ik op van een hidden field, de html-code zag er namelijk alsvolgt uit:

```html
<span>
    <span>De prijs van dit product is '19' euro en '99' cent</span>
    <span aria-hidden="true">19</span>
    <span aria-hidden="true">,</span>
    <span aria-hidden="true">99</span>
</span>
```

Het meest voor de hand liggend leek voor mij om de eerste zin te nemen en die vervolgens te converteren naar een correct formaat met een helper-functie. Dus werd mijn selector hiervoor:

```ts
page.locator('span:has-text("De prijs van dit product")').allTextContents();
```

Na het converteren naar een correct formaat `19,99` had ik de prijzen en kon ik nagaan of de sortering heeft gewerkt. 


## 3. Productdetail-pagina (PDP)

In de volgende test verifiëren we de detailpagina, maar vóór het navigeren naar de pagina worden calls naar de checkout en cart (`/basket`) geblokkeerd alvolgt:

```ts
await page.route('**/basket/**', route => route.abort());
await page.route('**/checkout/**', route => route.abort());
```

Vervolgens klik ik op het eerste product in de lijst, hier maak ik gebruik van `dblclick()` omdat dit de test stabieler maakte naar mijn mening. 

Een ander probleem dat zich voordeed waren de *assertions na het navigeren*. Deze maakten de test flaky omdat de pagina in veel gevallen nog niet helemaal geladen was. De oplossing hiervoor was de volgende methode `waitForURL()`, de klik redirect naar een pagina `/p/...` dus daar wachten we op:

```ts
await Promise.all([
    this.firstProductLink.dblclick(),
    this.page.waitForURL(url => url.toString().includes('/p/'))
]); 
```

Op de detailpagina heb ik waar mogelijk de `getByRole()`-methode gebruikt voor het vinden van locators en in het andere geval maakte ik gebruik van het `data-test`-attribuut dat aanwezig was.

Vervolgens klikken we op de add-to-cart button en blijven we op dezelfde pagina en merk op dat de cart nog steeds leeg is.


## 4. Paginering 

Ten slotte, het testen van de paginatie. Dit is effectief een bug op bol.com, hier heb je [pagina-1](https://www.bol.com/nl/nl/s/?searchtext=lego) van de resultaten voor lego en dit is [pagina-3](https://www.bol.com/nl/nl/s/?searchtext=lego&page=3&bltgh=60cd04c7-17f1-45a9-bb91-b85cf594e87d.g.i.QueryContextHook). Merk op dat er in de url een parameter `page=3` bijkomt, maar de resultaten zijn exact hetzelfde. 

Als de sortering veranderd wordt van `Relevantie` werkt deze functionaliteit wel, maar ik heb de test bewust niet aangepast, omdat het doel van de test niet is om per se te slagen, maar om na te gaan of een bepaalde functionaliteit werkt - en dat is hier niet het geval. De test is geschreven maar wordt by default overgeslagen.