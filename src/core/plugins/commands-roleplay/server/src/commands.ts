import * as alt from 'alt-server';
import { View_Events_Chat } from '../../../../shared/enums/views';
import { CHARACTER_PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../shared/locale/locale';
import { distance2d } from '../../../../shared/utility/vector';
import ChatController from '../../../../server/systems/chat';
import { RoleplayCmdsConfig } from './config';
import { Athena } from '../../../../server/api/athena';

function handleCommandOOC(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        Athena.player.emit.message(player, ChatController.getDescription('b'));
        return;
    }

    const fullMessage = args.join(' ');
    const closestPlayers = Athena.player.get.playersByGridSpace(player, RoleplayCmdsConfig.COMMAND_OOC_DISTANCE);

    alt.emitClient(
        closestPlayers,
        View_Events_Chat.Append,
        `${RoleplayCmdsConfig.CHAT_ROLEPLAY_OOC_COLOR}${player.data.name}: (( ${fullMessage} ))`,
    );
}

function handleCommandMe(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        Athena.player.emit.message(player, ChatController.getDescription('me'));
        return;
    }

    const fullMessage = args.join(' ');
    const closestPlayers = Athena.player.get.playersByGridSpace(player, RoleplayCmdsConfig.COMMAND_ME_DISTANCE);

    alt.emitClient(
        closestPlayers,
        View_Events_Chat.Append,
        `${RoleplayCmdsConfig.CHAT_ROLEPLAY_COLOR}${player.data.name} ${fullMessage}`,
    );
}

function handleCommandDo(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        Athena.player.emit.message(player, ChatController.getDescription('do'));
        return;
    }

    const fullMessage = args.join(' ');
    const closestPlayers = Athena.player.get.playersByGridSpace(player, RoleplayCmdsConfig.COMMAND_DO_DISTANCE);

    alt.emitClient(
        closestPlayers,
        View_Events_Chat.Append,
        `${RoleplayCmdsConfig.CHAT_ROLEPLAY_COLOR}* ${fullMessage} ((${player.data.name}))`,
    );
}

function handleCommandLow(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        Athena.player.emit.message(player, ChatController.getDescription('low'));
        return;
    }

    const fullMessage = args.join(' ');
    const closestPlayers = Athena.player.get.playersByGridSpace(player, RoleplayCmdsConfig.COMMAND_LOW_DISTANCE);

    alt.emitClient(
        closestPlayers,
        View_Events_Chat.Append,
        `${RoleplayCmdsConfig.CHAT_ROLEPLAY_LOW_COLOR}${player.data.name} ${fullMessage}`,
    );
}

function handleCommandWhisper(player: alt.Player, id: string, ...args) {
    if (args.length <= 0) {
        return;
    }

    if (typeof id !== 'string') {
        Athena.player.emit.message(player, ChatController.getDescription('w'));
        return;
    }

    if (id === null || id === undefined) {
        Athena.player.emit.message(player, ChatController.getDescription('w'));
        return;
    }

    const target = Athena.player.get.findByUid(id);
    if (!target || !target.valid) {
        Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
        return;
    }

    if (distance2d(target.pos, player.pos) > RoleplayCmdsConfig.COMMAND_WHISPER_DISTANCE) {
        Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.PLAYER_IS_TOO_FAR));
        return;
    }

    const fullMessage = args.join(' ');
    Athena.player.emit.message(
        player,
        `${RoleplayCmdsConfig.CHAT_ROLEPLAY_WHISPER_COLOR}You whisper: '${fullMessage}' to ${target.data.name}`,
    );

    Athena.player.emit.message(
        target,
        `${RoleplayCmdsConfig.CHAT_ROLEPLAY_WHISPER_COLOR}${player.data.name} whispers: ${fullMessage}`,
    );
}

export class RoleplayCommands {
    static init() {
        // Talk out of Character
        ChatController.addCharacterCommand(
            'b',
            LocaleController.get(LOCALE_KEYS.COMMAND_OOC, '/b'),
            CHARACTER_PERMISSIONS.NONE,
            handleCommandOOC,
        );

        ChatController.addCharacterCommand(
            'ooc',
            LocaleController.get(LOCALE_KEYS.COMMAND_OOC, '/ooc'),
            CHARACTER_PERMISSIONS.NONE,
            handleCommandOOC,
        );

        // Perform an Action
        ChatController.addCharacterCommand(
            'me',
            LocaleController.get(LOCALE_KEYS.COMMAND_ME, '/me'),
            CHARACTER_PERMISSIONS.NONE,
            handleCommandMe,
        );

        // Describe an Action
        ChatController.addCharacterCommand(
            'do',
            LocaleController.get(LOCALE_KEYS.COMMAND_DO, '/do'),
            CHARACTER_PERMISSIONS.NONE,
            handleCommandDo,
        );

        // Speak Low
        ChatController.addCharacterCommand(
            'low',
            LocaleController.get(LOCALE_KEYS.COMMAND_LOW, '/low'),
            CHARACTER_PERMISSIONS.NONE,
            handleCommandLow,
        );

        // Whisper
        ChatController.addCharacterCommand(
            'w',
            LocaleController.get(LOCALE_KEYS.COMMAND_WHISPER, '/w'),
            CHARACTER_PERMISSIONS.NONE,
            handleCommandWhisper,
        );

        // alias
        ChatController.addCharacterCommand(
            'whisper',
            LocaleController.get(LOCALE_KEYS.COMMAND_WHISPER, '/whisper'),
            CHARACTER_PERMISSIONS.NONE,
            handleCommandWhisper,
        );
    }
}
