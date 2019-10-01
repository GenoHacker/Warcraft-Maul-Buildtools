import { Tower } from '../../Specs/Tower';
import { EndOfRoundTower } from '../../Specs/EndOfRoundTower';
import { AttackActionTower } from '../../Specs/AttackActionTower';

export class Undead2 extends Tower implements EndOfRoundTower {


    public EndOfRoundAction(): void {
        BlzSetUnitBaseDamage(this.tower, BlzGetUnitBaseDamage(this.tower, 0) + 15, 0);
    }

}
