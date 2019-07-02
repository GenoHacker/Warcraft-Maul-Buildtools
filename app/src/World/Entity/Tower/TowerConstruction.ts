import { Trigger } from '../../../JassOverrides/Trigger';
import { Defender } from '../Players/Defender';
import * as settings from '../../GlobalSettings';
import { Log } from '../../../lib/Serilog/Serilog';
import { NagaSlave } from './WorkersUnion/NagaSlave';
import { Tower } from './Specs/Tower';
import { WarcraftMaul } from '../../WarcraftMaul';
import { OrcPeon } from './WorkersUnion/OrcPeon';
import { HumanPeasant } from './WorkersUnion/HumanPeasant';
import { UndeadAcolyte } from './WorkersUnion/UndeadAcolyte';
import { NightElfWisp } from './WorkersUnion/NightElfWisp';
import { SacrificialPit } from './Undead/SacrificialPit';
import { GenericAutoAttackTower } from './Specs/GenericAutoAttackTower';
import { EarthPandaren } from './Tavern/EarthPandaren';
import { StormPandaren } from './Tavern/StormPandaren';
import { FirePandaren } from './Tavern/FirePandaren';
import { AcidSpittingSpider } from './Arachnid/AcidSpittingSpider';
import { NerubianBehemoth } from './Arachnid/NerubianBehemoth';
import { CavernDruid } from './CavernousCreatures/CavernDruid';
import { CavernHermit } from './CavernousCreatures/CavernHermit';
import { CavernMushroom } from './CavernousCreatures/CavernMushroom';
import { CavernRevenant } from './CavernousCreatures/CavernRevenant';
import { CavernTurtle } from './CavernousCreatures/CavernTurtle';
import { CorruptedTreeofLife } from './CorruptedNightElves/CorruptedTreeofLife';
import { FelGuard } from './Demon/FelGuard';
import { Mannoroth } from './Demon/Mannoroth';
import { SummoningShrine } from './Demon/SummoningShrine';
import { KilJaeden } from './Demon/KilJaeden';
import { DwarfKing } from './Dwaven/DwarfKing';
import { MoonDancer } from './Galaxy/MoonDancer';
import { OgreWarrior } from './Giants/OgreWarrior';
import { GoblinMineLayer } from './Goblin/GoblinMineLayer';
import { GoblinTinkerer } from './Goblin/GoblinTinkerer';
import { GoblinBlademaster } from './Goblin/GoblinBlademaster';
import { VenomTower } from './Human/VenomTower';
import { LootBoxerHandler } from './LootBoxer/LootBoxerHandler';
import { Wyvern } from './Aviaries/Wyvern';
import { AntiJuggleTower } from './AntiJuggle/AntiJuggleTower';
import { DemonicIllidan } from './NightElf/DemonicIllidan';
import { CorruptedIllidan } from './NightElf/CorruptedIllidan';
import { Warden } from './NightElf/Warden';
import { Rokhan } from './OrcStronghold/Rokhan';
import { WarchiefThrall } from './OrcStronghold/WarchiefThrall';
import { Magtheridon } from './Outland/Magtheridon';
import { Prawn } from './Summons/Prawn';
import { Wisp } from './NightElf/Wisp';
import { VoidPriest } from './Void/VoidPriest';
import { KodoBeast } from './ShrineOfBuffs/KodoBeast';
import { Berserker } from './OrcStronghold/Berserker';
import { DemonizedDreadlord } from './Demon/DemonizedDreadlord';
import { VoidFissure } from './Void/VoidFissure';
import { ParasiticBroodmother } from './Arachnid/ParasiticBroodmother';
import { DraeneiSeer } from './Draenei/DraeneiSeer';
import { Akama } from './Draenei/Akama';
import { SalamanderLord } from './Draenei/SalamanderLord';
import { Gyrocopter } from './Aviaries/Gyrocopter';
import { FleshGolem } from './Giants/FleshGolem';
import { Kael } from './HighElven/Kael';
import { LavaSpawn } from './Summons/LavaSpawn';
import { StarChaser } from './Galaxy/StarChaser';
import { CelestialMist } from './Galaxy/CelestialMist';
import { FlyingDwarf } from './Dwaven/FlyingDwarf';
import { SirGalahad } from './Human/SirGalahad';
import { ForestTrollHighPriest } from './ForestTrolls/ForestTrollHighPriest';
import { GoblinSapper } from './Goblin/GoblinSapper';
import { GoblinAlchemist } from './Goblin/GoblinAlchemist';
import { BronzeDragonWhelp } from './Dragons/BronzeDragonWhelp';
import { BronzeDrake } from './Dragons/BronzeDrake';
import { BronzeDragon } from './Dragons/BronzeDragon';
import { GargoyleSpire } from './Forsaken/GargoyleSpire';
import { Varimathras } from './Forsaken/Varimathras';


export class TowerConstruction {
    private towerConstructTrigger: Trigger;
    private towerRemoveUpgradeTrigger: Trigger;
    private towerTypes: Map<number, object> = new Map<number, object>();
    public genericAttacks: Map<number, GenericAutoAttackTower> = new Map<number, GenericAutoAttackTower>();
    private genericAttackTrigger: Trigger;
    private game: WarcraftMaul;
    private lootBoxerHander: LootBoxerHandler;
    public lootBoxerTowers: number[] = [
        FourCC('u044'), // Tier 1
        FourCC('u045'), // Tier 2
        FourCC('u047'), // Tier 3
        FourCC('u046'), // Tier 4
        FourCC('u048'), // Tier 5
        FourCC('u049'), // Tier 6
        FourCC('u04A'), // Tier 7
        FourCC('u04B'), // Tier 8
        FourCC('u04C'), // Tier 9
    ];

    constructor(game: WarcraftMaul) {
        Log.Debug('Starting towercons');
        this.game = game;
        this.InitTypes();
        this.lootBoxerHander = new LootBoxerHandler(this, game);
        this.towerConstructTrigger = new Trigger();
        this.towerConstructTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_CONSTRUCT_FINISH);
        this.towerConstructTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_UPGRADE_FINISH);
        this.towerConstructTrigger.AddAction(() => this.ConstructionFinished());

        this.towerRemoveUpgradeTrigger = new Trigger();
        this.towerRemoveUpgradeTrigger.RegisterAnyUnitEventBJ(EVENT_PLAYER_UNIT_UPGRADE_START);
        this.towerRemoveUpgradeTrigger.AddAction(() => this.RemoveUpgradingTower());


        this.genericAttackTrigger = new Trigger();
        this.genericAttackTrigger.RegisterPlayerUnitEventSimple(Player(COLOUR.NAVY), EVENT_PLAYER_UNIT_ATTACKED);
        this.genericAttackTrigger.RegisterPlayerUnitEventSimple(Player(COLOUR.TURQUOISE), EVENT_PLAYER_UNIT_ATTACKED);
        this.genericAttackTrigger.RegisterPlayerUnitEventSimple(Player(COLOUR.VOILET), EVENT_PLAYER_UNIT_ATTACKED);
        this.genericAttackTrigger.RegisterPlayerUnitEventSimple(Player(COLOUR.WHEAT), EVENT_PLAYER_UNIT_ATTACKED);
        this.genericAttackTrigger.AddAction(() => this.DoGenericTowerAttacks());
    }

    private RemoveUpgradingTower(): void {
        const tower: unit = GetTriggerUnit();
        const owner: Defender | undefined = this.game.players.get(GetPlayerId(GetOwningPlayer(tower)));
        if (!owner) {
            return;
        }
        const instance: Tower | undefined = owner.towers.get(GetHandleIdBJ(tower));
        if (instance) {
            instance.Sell();
        }
    }

    private ConstructionFinished(): void {
        const tower: unit = GetTriggerUnit();

        const owner: Defender | undefined = this.game.players.get(GetPlayerId(GetOwningPlayer(tower)));
        UnitRemoveAbilityBJ(FourCC('ARal'), tower);

        if (!owner) {
            return;
        }

        this.SetupTower(tower, owner);
    }

    public SetupTower(tower: unit, owner: Defender): Tower {
        let ObjectExtendsTower: Tower;
        if (this.isLootBoxer(tower)) {
            tower = this.lootBoxerHander.handleLootBoxTower(tower, owner, this.lootBoxerTowers.indexOf(GetUnitTypeId(tower)));
            UnitRemoveAbilityBJ(FourCC('ARal'), tower);
        }

        const obj: object | undefined = this.towerTypes.get(GetUnitTypeId(tower));
        if (obj) {
            // @ts-ignore
            ObjectExtendsTower = new obj(tower, owner, this.game);
        } else {
            ObjectExtendsTower = new Tower(tower, owner, this.game);
        }
        if (ObjectExtendsTower.IsEndOfRoundTower()) {
            this.game.gameRoundHandler.endOfTurnTowers.set(ObjectExtendsTower.handleId, ObjectExtendsTower);
        }
        if (ObjectExtendsTower.IsAttackActionTower()) {
            this.game.gameDamageEngine.AddInitialDamageEventTower(ObjectExtendsTower.handleId, ObjectExtendsTower);
        }

        if (ObjectExtendsTower.IsInitialDamageModificationTower()) {
            this.game.gameDamageEngine.AddInitialDamageModificationEventTower(ObjectExtendsTower.handleId, ObjectExtendsTower);
        }

        if (ObjectExtendsTower.IsGenericAutoAttackTower()) {
            this.genericAttacks.set(ObjectExtendsTower.handleId, ObjectExtendsTower);
        }
        if (ObjectExtendsTower.IsAreaEffectTower()) {
            let area: number | undefined;

            for (let i: number = 0; i < settings.PLAYER_AREAS.length; i++) {
                if (settings.PLAYER_AREAS[i].ContainsUnit(tower)) {
                    area = i;
                    break;
                }
            }
            if (area) {
                this.game.worldMap.playerSpawns[area].areaTowers.set(ObjectExtendsTower.handleId, ObjectExtendsTower);
            } else {
                Log.Fatal(`${GetUnitName(tower)} built outside of requires area. Please screenshot and report`);
            }
        }
        return ObjectExtendsTower;
    }

    private InitTypes(): void {

        // WorkersUnion
        this.towerTypes.set(FourCC('h03G'), NagaSlave);
        this.towerTypes.set(FourCC('h03E'), OrcPeon);
        this.towerTypes.set(FourCC('h03F'), HumanPeasant);
        this.towerTypes.set(FourCC('h03I'), UndeadAcolyte);
        this.towerTypes.set(FourCC('h03H'), NightElfWisp);

        // Undead
        this.towerTypes.set(FourCC('h00R'), SacrificialPit);

        // Tavern
        this.towerTypes.set(FourCC('h01F'), EarthPandaren);
        this.towerTypes.set(FourCC('h01J'), StormPandaren);
        this.towerTypes.set(FourCC('h01I'), FirePandaren);

        // Arachnid
        this.towerTypes.set(FourCC('o019'), AcidSpittingSpider);
        this.towerTypes.set(FourCC('h00W'), NerubianBehemoth);
        this.towerTypes.set(FourCC('o01A'), ParasiticBroodmother);

        // Aviaries
        this.towerTypes.set(FourCC('oC60'), Wyvern);
        this.towerTypes.set(FourCC('hC36'), Gyrocopter);


        // Cavernous Creatures
        this.towerTypes.set(FourCC('h04Q'), CavernDruid);
        this.towerTypes.set(FourCC('h04M'), CavernHermit);
        this.towerTypes.set(FourCC('h04T'), CavernMushroom);
        this.towerTypes.set(FourCC('h04O'), CavernRevenant);
        this.towerTypes.set(FourCC('h04N'), CavernTurtle);

        // CorruptedNightElves
        this.towerTypes.set(FourCC('n00P'), CorruptedTreeofLife);

        // Demon
        this.towerTypes.set(FourCC('h03W'), FelGuard);
        this.towerTypes.set(FourCC('o00L'), Mannoroth);
        this.towerTypes.set(FourCC('n00U'), SummoningShrine);
        this.towerTypes.set(FourCC('eC93'), KilJaeden);
        this.towerTypes.set(FourCC('h00F'), DemonizedDreadlord);

        // Draenei
        this.towerTypes.set(FourCC('h04F'), DraeneiSeer);
        this.towerTypes.set(FourCC('h00I'), Akama);
        this.towerTypes.set(FourCC('h04I'), SalamanderLord);

        // Dragons
        this.towerTypes.set(FourCC('o00M'), BronzeDragonWhelp);
        this.towerTypes.set(FourCC('o01F'), BronzeDrake);
        this.towerTypes.set(FourCC('o01K'), BronzeDragon);


        // Dwarven
        this.towerTypes.set(FourCC('n05Q'), DwarfKing);
        this.towerTypes.set(FourCC('n05N'), FlyingDwarf);

        // Forest Trolls
        this.towerTypes.set(FourCC('n03I'), ForestTrollHighPriest);

        // Forsaken
        this.towerTypes.set(FourCC('u00F'), GargoyleSpire);
        this.towerTypes.set(FourCC('u012'), Varimathras);

        // Galaxy
        this.towerTypes.set(FourCC('e00K'), MoonDancer);
        this.towerTypes.set(FourCC('e00P'), StarChaser);
        this.towerTypes.set(FourCC('e00R'), CelestialMist);

        // Giants
        this.towerTypes.set(FourCC('oC35'), OgreWarrior);
        this.towerTypes.set(FourCC('o00G'), FleshGolem);

        // Goblin
        this.towerTypes.set(FourCC('o01R'), GoblinMineLayer);
        this.towerTypes.set(FourCC('o01S'), GoblinTinkerer);
        this.towerTypes.set(FourCC('o01P'), GoblinBlademaster);
        this.towerTypes.set(FourCC('o01M'), GoblinSapper);
        this.towerTypes.set(FourCC('o01O'), GoblinAlchemist);

        // High Elven
        this.towerTypes.set(FourCC('o00N'), Kael);

        // Human
        this.towerTypes.set(FourCC('h045'), VenomTower);
        this.towerTypes.set(FourCC('n05C'), SirGalahad);

        // Night Elf
        this.towerTypes.set(FourCC('h00S'), DemonicIllidan);
        this.towerTypes.set(FourCC('eC83'), CorruptedIllidan);
        this.towerTypes.set(FourCC('h00G'), Warden);
        this.towerTypes.set(FourCC('e00E'), Wisp);


        // Orc Stronghold
        this.towerTypes.set(FourCC('h002'), Rokhan);
        this.towerTypes.set(FourCC('oC65'), WarchiefThrall);
        this.towerTypes.set(FourCC('o00E'), Berserker);

        // Outland
        this.towerTypes.set(FourCC('u01C'), Magtheridon);


        // Summons
        this.towerTypes.set(FourCC('h027'), Prawn);
        this.towerTypes.set(FourCC('h026'), LavaSpawn);

        // Shrine of buffs
        this.towerTypes.set(FourCC('oC58'), KodoBeast);

        // Void
        this.towerTypes.set(FourCC('h02F'), VoidPriest);
        this.towerTypes.set(FourCC('h01M'), VoidFissure);

        // AntiJuggle
        this.towerTypes.set(FourCC('uC14'), AntiJuggleTower);
    }

    private DoGenericTowerAttacks(): void {
        for (const tower of this.genericAttacks.values()) {
            tower.GenericAttack();
        }
    }

    private isLootBoxer(tower: unit): boolean {
        return this.lootBoxerTowers.indexOf(GetUnitTypeId(tower)) > -1;
    }
}
