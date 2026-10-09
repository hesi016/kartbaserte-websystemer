Dette prosjektet ble utviklet som en eksamensoppgave i Kartbaserte websystemer ved Kristiania, i samarbeid med en medstudent. Vi laget et interaktivt kart over Norges nødetater, der brukeren kan utforske ulike kartlag, justere visningen og legge til egne punkter. Vi samarbeidet gjennom hele prosessen, fra idé og planlegging til utvikling og utforming av løsningen.

# Norges Nødetater

Beskrivelse av prosjektet

Prosjektet vårt består av et interaktivt geografisk informasjonssystem (GIS) som visualiserer Norges nødetater.
Dette kartet gir brukeren muligheten til å få en oversikt over viktige institusjoner som AMK-distrikter,
politidistriker, brannstasjoner og sivilforsvaret.

Løsningen er utviklet med fokus på interaktivitet, noe som gir brukeren stor grad av kontroll over hvilke datasett som
vises på kartet. Brukeren kan skru av og på de ulike lagene, og dermed utforske kartet på egne premisser.
Dette gir fleksibilitet til å sammenligne og forstå hvordan nødetatene er geografisk fordelt i Norge.

For å gjøre det lettere for brukeren å skille mellom de ulike nødetatene visuelt, har vi brukt fargekoding i kartet.
Brannstasjoner er markert med rød farge, politidistrikter med blå, AMK-distrikter med oransje og sivilforsvaret med grønn.
Dette gir en intuitiv oversikt og gjør det enklere å tolke kartinformasjonen ved første øyekast.

For visningen av brannstasjoner er det implementert en klyngevisualisering (cluster effect) i kartlaget.
Denne funksjonen aggregerer nærliggende punkter til en samlet visuell representasjon ved lavere zoom-nivåer,
noe som gir brukeren en oversiktlig fremstilling av tettheten av stasjoner i et gitt område.
Ved å zoome inn oppløses klyngene gradvis, slik at individuelle brannstasjoner fremkommer med presis geografisk plassering.

AMK-distriktene er interaktiv ved å gi brukeren informasjon om både distriktets navn og geografiske lokalisering.
Ved å klikke på et hvilket som helst punkt innenfor kartområdet, får brukeren opp opplysninger om hvilket AMK-distrikt vedkommende befinner seg i.

Sivilforsvaret er visualisert med polygonlag som representerer de geografiske grensene for hvert distrikt,
definert gjennom koordinatbaserte geometrier. For å forbedre brukeropplevelsen og gjøre det enklere å identifisere
og utforske de ulike områdene, er det implementert en hover-funksjonalitet som fremhever det aktuelle distriktet når
brukeren beveger musepekeren over det.

Det er implementert en funksjonalitet hvor brukeren kan legge til egne punkter direkte på kartet gjennom en dedikert knapp.
Disse punktene lagres lokalt i nettleserens localStorage.

Vi har også implementert en skaleringsfunksjon (opacity-slider) for lagene til AMK, politidistrikt og sivilforsvaret.
Dette lar brukeren justere gjennomsiktigheten til hvert lag, slik at man enkelt kan kombinere og sammenligne ulike datasett
uten at informasjonen overlapper eller forsvinner i kartet.

Vi har implementert et oversiktskart (overview map) som gir brukeren en liten versjon av hovedkartet.
Dette gjør det lettere å se hvor man befinner seg i Norge og gir en bedre oversikt når man navigerer rundt på kartet.

## Deployed to

- Heroku : https://ancient-eyrie-88796-861177c95f58.herokuapp.com/

## Prosessen

Vi har begge vært aktivt involvert i prosessen fra start til slutt. Prosjektet vårt ble påbegynt noen dager før eksamensutleveringen,
da vi begynte å samle ideer og tanker basert datasett som vi fant på nettsider som vi tidligere har støtt på i undervisningen.
Vi så for oss å lage et interaktivt kart som visualiserte Norges nødetater, med fokus på brannstasjoner, politistasjoner og sykehus.
Imidlertid viste det seg at de tilgjengelige datasettene ikke inkluderte informasjon om sykehus,
og vi måtte derfor tilpasse prosjektet. I stedet valgte vi å bruke AMK-distrikter som erstatning for sykehus,
samt politidistrikter i stedet for politistasjoner. Opprinnelig hadde vi valgt tre datasett, men
eksamenskravene spesifiserte at vi burde inkludere fire datasett. For å møte dette kravet, valgte vi å legge til sivilforsvarets distriktedata.

Etter at vi hadde utviklet en overordnet plan, opprettet vi prosjekt sammen før vi begynte arbeidet hver for oss - men med god kommunikasjon hele veien.
Dette dannet et godt grunnlag for fremtidige avgjørelser i prosjektet. Vi har valgt å bruke GitHub som vår samarbeidsplattform,
da det gir oss muligheten til å effektivt dele kode (selvom vi har brukt github har vi sittet sammen).
Arbeidet ble deretter delt opp, hvor én av oss fokuserte på implementeringen av PostGIS for databaser,
mens den andre håndterte geoJSON-dataene. Videre diskuterte vi hvordan kartets styling skulle se ut og fordelte ansvaret for ulike oppgaver.
Begge har vært aktivt involvert i hele prosessen og har kontinuerlig støttet hverandre når vi har møtt utfordringer underveis.

## Kommentarer til arbeidet vårt

- Interaktivitet løsningen _Geografiske punkter og local storage_

- Overlapping på clustered vector source på Brannstasjoner.
  Ved helt identiske koordinater blir flere brannstasjoner samlet i én klynge, selv på maks zoom.
  Dette er en teknisk begrensning vi er klar over. Eks. det er 3 av samme kordinater på brannstasjonen "Fåvang".

- Synkronisert sidepanel (meny / header)
  Vårt sidepanel er synkronisert med synlige kartlag gjennom interaktive avkrysningsbokser og gjennomsiktighets-funksjon.
  Brukeren kan kontrollere hvilke elementer som vises på kartet i sanntid, og brukergrensesnittet oppdateres umiddelbart
  i henhold til disse endringene. Til tross for at vi ikke filtrerer sidepanelet basert på kartutsnitt, mener vi at denne løsningen
  likevel oppfyller kravet om synkronisering gjennom styring av lag-synlighet.

- tmp
  "tmp" brukes kun til midlertidige data og caches under lokal utvikling. Denne mappen er lagt til i ".gitignore"
  slik at den ikke blir versjonskontrollert.

- Local storage
  Vi fikk litt dårlig tid, når vi skulle implementere at brukeren kunne legge inn et eget punkt. Dermed blir det lagret to
  punkter "feature" og "dine punkter" når brukeren setter et punkt og etterpå lagrer det. Dette har ingenting å si med tanken
  på UI for brukeren, da punktet blir lagret som det de setter det som uansett.
