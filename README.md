# Hong Kong Horse Racing Data Crawler

To crawl past and future racing data from HKJC site to machine readable format.

Not in active development right now. Might revisit this later. Feel free to contribute if interested.

## TODO
- [x] Crawl past race records
- [x] Crawl past horse records
- [ ] Crawl future race schedule
- [ ] Cross check available data columns, align labels
- [ ] Consider writing to a database directly or a appendable file format?

## Data Sample
> Labels / Foramtting to be aligned and cleaned soon.

### Horse Record
```json
  {
    "Country of Origin / Age": "AUS / 3",
    "Colour / Sex": "Chestnut / Gelding",
    "Import Type": "PPG",
    "Season Stakes*": "$7,361,000",
    "Total Stakes*": "$9,116,600",
    "No. of 1-2-3-Starts*": "5-0-2-9",
    "No. of starts in past 10race meetings": "2",
    "Current Stable Location(Arrival Date)": "Hong Kong(23/12/2018)",
    "Trainer": "J Moore",
    "Owner": "Andrea Tien & Arthur Cheng",
    "Current Rating": "119",
    "Start ofSeason Rating": "89",
    "Sire": "Sebring",
    "Dam": "Pinocchio",
    "Dam's Sire": "Encosta de Lago",
    "Same Sire": "D428\n                                            D450\n                                            ALLOY STAR\n                                            ASSIMILATE\n                                            BIG LUCK CHAMP\n                                            DIAMOND RHYME\n                                            DRAGON PRIDE\n                                            HAPPY SEBRING\n                                            JUDY'S STAR\n                                            LEAP OF FAITH\n                                            MISCHIEVOUS SUNDAE\n                                            VICTORIOUS SEEKER\n                                            VILLA FIONN\n                                            VIRTUS STAR\n                                            WINNING DELIGHT\n                                            YEE CHEONG BABY"
  },
```

### Race Record
```json
  {
    "RaceIndex": "606",
    "Pla.": "11",
    "Date": "26/04/20",
    "RC/Track/Course": "ST / Turf / \"A\"",
    "Dist.": "1200",
    "G": "G",
    "RaceClass": "G1",
    "Dr": "5",
    "Rtg.": "119",
    "Trainer": "J Moore",
    "Jockey": "Z Purton",
    "LBW": "73-1/2",
    "Win Odds": "2",
    "Act.Wt.": "122",
    "RunningPosition": "1 1 11",
    "Finish Time": "1.20.17",
    "Declar.Horse Wt.": "1251",
    "Gear": "--",
    "VideoReplay": ""
  },
```

## License
MIT
