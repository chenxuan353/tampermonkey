setTimeout(function () {
    "use strict";
    const BASICMOUNT = "#tweetTransEdit ";
    let configapp = new Vue({
        el: BASICMOUNT + "#script_trans_config_out",
        data: {
            editor: null,
            default_tamplate: "<p>翻译自日语</p>",
            trans_tamplate: "default",
            trans_tamplate_str: "<p>翻译自日语</p>",
            trans_tamplates: {
                default: `<p>翻译自日语</p>`,
            },
            switch_config: {},
        },
        methods: {
            _flushEdit() {
                this.editor.txt.html(this.trans_tamplate_str);
            },
            _fillConfig() {
                this.trans_tamplate = ConfigTool.getConfig("trans_tamplate");
                this.trans_tamplate_str = ConfigTool.getConfig(
                    "trans_tamplate_str"
                );
                this.trans_tamplates = ConfigTool.getConfig("trans_tamplates");
                for (let key in ConfigTool.CONFIG_SWITCH) {
                    let value = ConfigTool.CONFIG_SWITCH[key];
                    this.switch_config[value] = ConfigTool.CONFIG_DES[value];
                    this.switch_config[value].value = ConfigTool.getConfig(
                        value
                    );
                }
            },
            _tempSaveConfig() {
                this.trans_tamplates[
                    this.trans_tamplate
                ] = this.trans_tamplate_str;
                ConfigTool.setConfig("trans_tamplate", this.trans_tamplate);
                ConfigTool.setConfig(
                    "trans_tamplate_str",
                    this.trans_tamplate_str
                );
                ConfigTool.setConfig("trans_tamplates", this.trans_tamplates);
                for (let key in this.switch_config) {
                    ConfigTool.setConfig(key, this.switch_config[key].value);
                }
            },
            _closeConfigWindow() {
                if (DisplayTool.transWindowId != null) {
                    layer.close(DisplayTool.configWindowId);
                    DisplayTool.transWindowId = null;
                } else {
                    layer.closeAll();
                }
            },
            _changeTemplateName() {
                let newTemplateName = $(
                    BASICMOUNT + ".edit_template_edit"
                ).val();
                this.trans_tamplates[newTemplateName] = this.trans_tamplates[
                    this.trans_tamplate
                ];
                delete this.trans_tamplates[this.trans_tamplate];
                this.trans_tamplate = newTemplateName;
            },
            editTemplateName(goEdit = false) {
                let vthis = this;
                if (
                    $(BASICMOUNT + ".edit_template").text() == "重命名" ||
                    goEdit == true
                ) {
                    $(BASICMOUNT + ".edit_template_edit").attr(
                        "readonly",
                        null
                    );
                    $(BASICMOUNT + ".edit_template_select").attr(
                        "disabled",
                        "disabled"
                    );
                    $(BASICMOUNT + ".edit_template").text("完成");
                } else {
                    $(BASICMOUNT + ".edit_template_edit").attr(
                        "readonly",
                        "readonly"
                    );
                    $(BASICMOUNT + ".edit_template_select").attr(
                        "disabled",
                        null
                    );
                    $(BASICMOUNT + ".edit_template").text("重命名");
                    // 移除首尾空白符
                    $(BASICMOUNT + ".edit_template_edit").val(
                        $(BASICMOUNT + ".edit_template_edit")
                            .val()
                            .replace(/^\s*|\s*$/g, "")
                    );
                    let newTemplateName = $(
                        BASICMOUNT + ".edit_template_edit"
                    ).val();
                    if (newTemplateName == this.trans_tamplate) {
                        return;
                    }
                    if (this.trans_tamplates[newTemplateName]) {
                        layer.confirm(
                            "该模版名已存在，是否覆盖？",
                            {
                                btn: ["是", "否"], //按钮
                            },
                            function () {
                                vthis._changeTemplateName();
                                layer.msg("修改成功！");
                            }
                        );
                        return;
                    }
                    vthis._changeTemplateName();
                    layer.msg("修改成功！");
                }
            },
            createTemplate() {
                let newName = "新模版";
                let count = 1;
                while (this.trans_tamplates[newName]) {
                    newName = "新模版" + count;
                    count++;
                }
                this.trans_tamplate = newName;
                this.trans_tamplate_str = this.default_tamplate;
                this.trans_tamplates[newName] = this.trans_tamplate_str;
                this._flushEdit();
                this.editTemplateName(true);
            },
            deleteTemplate() {
                let vthis = this;
                layer.confirm(
                    "确认删除当前模版？",
                    {
                        btn: ["确认", "再想想"], //按钮
                    },
                    function (index) {
                        delete vthis.trans_tamplates[vthis.trans_tamplate];
                        vthis.trans_tamplate = "";
                        for (let tampName in vthis.trans_tamplates) {
                            vthis.trans_tamplate = tampName;
                            break;
                        }
                        if (vthis.trans_tamplate == "") {
                            vthis.trans_tamplates["default"] =
                                vthis.default_tamplate;
                            vthis.trans_tamplate = "default";
                        }
                        vthis.trans_tamplate_str =
                            vthis.trans_tamplates[vthis.trans_tamplate];
                        vthis._flushEdit();
                        layer.close(index);
                    }
                );
            },
            selectTemplate(key) {
                this.trans_tamplate = key;
                this.trans_tamplate_str = this.trans_tamplates[
                    this.trans_tamplate
                ];
                this._flushEdit();
            },
            configSave() {
                this._tempSaveConfig();
                ConfigTool.saveConfig();
                this._closeConfigWindow();
                layer.msg("已保存配置");
            },
            configTempSave() {
                // 更新值
                this._tempSaveConfig();
                this._closeConfigWindow();
                layer.msg("临时保存配置");
            },
            configReset() {
                this._flushEdit();
                layer.msg("已重置选项");
            },
            configCancel() {
                this._closeConfigWindow();
                layer.msg("已取消配置");
            },
        },
        mounted() {
            // `this` 指向 vm 实例
            let vthis = this;
            // 初始化编辑器
            vthis.editor = DisplayTool.createWangEditor(
                BASICMOUNT + "#wangeditor_config"
            );
            vthis.editor.config.onchange = function (newHtml) {
                vthis.trans_tamplate_str = newHtml;
                vthis.trans_tamplates[vthis.trans_tamplate] =
                    vthis.trans_tamplate_str;
                ConfigTool.setConfig("trans_tamplate_str", newHtml);
            };
            vthis._fillConfig();
            vthis._flushEdit();
        },
    });
    let transApp = new Vue({
        el: BASICMOUNT + "#script_trans_out",
        data: {
            tweet_html: "",
            tweet_text: "",
            trans: "",
            trans_tamplate: "default",
            trans_tamplate_str: "<p>翻译自日语</p>",
            trans_tamplates: {
                default: `<p>翻译自日语</p>`,
            },
        },
        watch: {
            tweet_text() {
                this.tweet_html = DisplayTool.textparse(this.tweet_text);
            },
        },
        methods: {
            _closeConfigWindow() {
                if (DisplayTool.transWindowId != null) {
                    layer.close(DisplayTool.transWindowId);
                    DisplayTool.transWindowId = null;
                } else {
                    layer.closeAll();
                }
            },
            _fillConfig() {
                this.trans_tamplate = ConfigTool.getConfig("trans_tamplate");
                this.trans_tamplate_str = ConfigTool.getConfig(
                    "trans_tamplate_str"
                );
                this.trans_tamplates = ConfigTool.getConfig("trans_tamplates");
            },
            selectTemplate(key) {
                this.trans_tamplate = key;
                this.trans_tamplate_str = this.trans_tamplates[
                    this.trans_tamplate
                ];
            },
            pasteToEdit() {
                this.editor.txt.html(this.editor.txt.html() + this.tweet_html);
            },
            trans_submit() {
                Logger.info("保存！");
            },
            trans_reset() {
                this.editor.txt.html(this.tweet_html);
            },
            trans_cancel() {
                this._closeConfigWindow();
            },
        },
        mounted() {
            // `this` 指向 vm 实例
            let vthis = this;
            vthis.editor = DisplayTool.createWangEditor(
                BASICMOUNT + "#wangeditor_trans"
            );
            vthis.editor.txt.html(vthis.trans);
            vthis.editor.config.onchange = function (newHtml) {
                vthis.trans = newHtml;
            };
            vthis._fillConfig();
        },
    });
    Tweet.getNowTweetId = function () {
        Tweet.isTweet = true;
        // 获取推文ID
        return "123456789";
    };
    window.debugConfigapp = configapp;
    window.debugTransApp = transApp;
}, 1100);
setTimeout(function () {
    window.debugTransApp.tweet_text = Tweet.getTransDisplayText(Tweet.nowTweetInfo.tweet);
}, 2100);
