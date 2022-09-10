# Was soll ein nutzer machen können?

Roulette spielen, setzen auf:
Plein -> eine Zahl von 1 - 37
Reihe -> eine von 3 reihen
Schwarz oder Rot


Je nach spielart wird andere contract function angesprochen
Speichert für jede spielart den tipp + einsatz in mapping
Speichert für jede spielart den zu erwartenden blockhash im mapping

Durchlauf:
Spieler callt schwarzrot function
Existiert für seine adresse kein eintrag im mapping für den nächsten blockhash wird der blockhash + 2 eingetragen und die funktion beendet.
Zusätzlich wird sein tipp (rot / schwarz) umgewandelt in 0 oder 1 und auch im mapping gespeichert.

Existiert bereits ein eintrag wird geprüft ob der blockhash mittlerweile existiert dh. nicht null ist.

Falls ja wird der blockhash genommen und in einen uint geparst.
Dieser wird mit mod 2 + 1 berechnet um einen wert zwischen
0 und 1 zu erhalten. 
(Bei den anderen Spielmodi: Dieser wird mod 38 berechnet um einen wert zwischen 0 - 37 zu erhalten.
)

Dann wird dieser wert verglichen mit dem tipp des nutzers, falls er korrekt ist wird dem nutzerkonto sein einsatz * 2 verrechnet.

Mappings:

rougenoirAmount = address => uint256
rougenoirBet = address => uint8
rougenoirBlockHash = address => blockhash / number


pleinAmount = address => uint256
pleinBet = address => uint8;
pleinBlockHash = address => blockhash / number;



Über webinterface tipp auswählen, einsatz eingeben und dann wird transaktion aufgefordert zu signieren

