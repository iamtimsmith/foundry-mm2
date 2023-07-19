export const RegisterSettings = function () {
    /* ------------------------------------ */
    /* User settings                        */
    /* ------------------------------------ */
    game.settings.register("mutants-and-masterminds-3e", "typeroll", {
        name: "MM3.SETTING.Typejet",
        hint: "",
        scope: "world",
        config: true,
        default: "1D20",
        type: String,
        choices:{
            "1D20":"MM3.SETTING.Standard1d20",
            "3D20":"MM3.SETTING.Guide3d20",
            "3D6":"MM3.SETTING.3d6",
        }
    });

    game.settings.register("mutants-and-masterminds-3e", "dcroll", {
        name: "MM3.SETTING.DCRoll",
        hint: "MM3.SETTING.DCRollHint",
        scope: "client",
        config: true,
        default: "shift",
        type: String,
        choices:{
            "shift":"MM3.SETTING.ShiftClicgauche",
            "clic":"MM3.SETTING.Clicgauche",
        }
    });

    game.settings.register("mutants-and-masterminds-3e", "pauselogo", {
        name: "MM3.SETTING.Pause",
        hint: "MM3.SETTING.PauseHint",
        scope: "client",
        config: true,
        default: "Pause_Icon_1",
        type: String,
        choices:{
            "default":"MM3.SETTING.Defaut",
            "Pause_Icon_1":"MM3.SETTING.Pause1",
            "Pause_Icon_2":"MM3.SETTING.Pause2",
            "Pause_Icon_3":"MM3.SETTING.Pause3",
        }, 
        onChange: value => { 
            if(value !== 'default') {
                $("#pause img").remove();
                $("#pause figcaption").remove();
                
                const pause = $("#pause video");
                if(pause.length === 0) {
                    $("#pause").append(`<video width="300" height="200" loop autoplay="autoplay"><source src="systems/mutants-and-masterminds-3e/assets/pause/${value}.webm" type="video/webm" /></video>`);
                } else {
                    $("#pause video").attr('src', `systems/mutants-and-masterminds-3e/assets/pause/${value}.webm`);
                    $("#pause video")[0].load();
                    $("#pause video")[0].play();
                }                
            } else {
                $("#pause video").remove();
                $("#pause").append(`<img src="icons/svg/clockwork.svg" class="fa-spin">`);
                $("#pause").append(`<figcaption>Game Paused</figcaption>`);
                
            }            
        }
    });

    game.settings.register("mutants-and-masterminds-3e", "menu", {
        name: "MM3.SETTING.Menu",
        hint: "MM3.SETTING.MenuHint",
        scope: "client",
        config: true,
        default: "dark",
        type: String,
        choices:{
            "default":"MM3.SETTING.Defaut",
            "bleuclair":"MM3.SETTING.BleuClair",
            "violetclair":"MM3.SETTING.VioletClair",
            "violet":"MM3.SETTING.Violet",
            "bleufonce":"MM3.SETTING.BleuFonce",
        }, 
        onChange: value => { 
            $("section#ui-left").removeClass(['bleuclair', 'violetclair', 'violet', 'bleufonce']);
            $("div#sidebar.app").removeClass(['bleuclair', 'violetclair', 'violet', 'bleufonce']);

            $("section#ui-left").addClass(value);
            $("div#sidebar.app").addClass(value);
        }
    });
};