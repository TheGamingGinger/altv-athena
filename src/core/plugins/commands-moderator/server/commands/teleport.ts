import alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { command } from '../../../../server/decorators/commands';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';

class TeleportCommands {
    @command('gethere', '/gethere <ID> - Teleports a player to your position.', PERMISSIONS.ADMIN)
    private static GetHereCommand(player: alt.Player, id: number) {
        const target = Athena.player.get.findByUid(id);

        if (!target || !target.valid || !id || target === player) return;

        Athena.player.safe.setPosition(target, player.pos.x + 1, player.pos.y, player.pos.z);
        Athena.player.emit.notification(player, `Successfully teleported ${target.data.name} to your position!`);
    }

    @command('goto', '/goto <ID> - Teleports you to the specified player.', PERMISSIONS.ADMIN)
    private static goToCommand(player: alt.Player, id: number) {
        const target = Athena.player.get.findByUid(id);

        if (!target || !target.valid || !id || target === player) return;

        Athena.player.safe.setPosition(player, target.pos.x + 1, target.pos.y, target.pos.z);
    }
}
