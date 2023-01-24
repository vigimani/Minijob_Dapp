# FullStack-MiniJob-DApp-hardhatdeploy-hardhat-wagmi-rainbowkit-events-nextjs

## Mini Job Dapp

L’objectif est de créer une Dapp sur laquelle chacun sera libre de demander de l’aide, aider quelqu’un ou être aidé, et enfin, payer quelqu’un pour l’aide apportée ou être payé pour l’aide apportée.

**Premièrement, l’utilisateur pourra créer un job :**

![alt text](https://github.com/vigimani/Minijob_Dapp/blob/main/addajob.png)


**Au niveau de l’UI, il y aura deux champs importants : **
- un champs description du job
- un champs où l’utilisateur qui veut être aidé (qui créer le job) précise quel montant il donnera à la personne qui va l’aider (en ETH)

Au niveau technique, l’utilisateur qui créé le job donnera la « récompense » directement au smart contract. Lorsque la personne qui réservera le job aura terminé, l’utilisateur qui a créé le job déclenchera une fonction qui permettra de payer automatiquement le « travailleur ».


**Plusieurs informations seront indispensables dans le smart contract pour chaque job : **
- id
- auteur
- travailleur
- description
- prix
- si le job est terminé
- si le job est réservé


**Au niveau de la liste des jobs**

![alt text](https://github.com/vigimani/Minijob_Dapp/blob/main/home.png)

