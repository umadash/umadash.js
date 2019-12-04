import { GUI } from "dat.gui";

export class DatGUIUtil {

    private static instance: DatGUIUtil;
    private dat: GUI;

    private constructor() {
        this.dat = new GUI();
    }

    public static getInstance(): DatGUIUtil {
        if (!this.instance) {
            this.instance = new DatGUIUtil();
        }
        return this.instance;
    }

    public addFolder(folderName: string, obj: object, open: boolean = false): GUI {
        const folder: GUI = this.dat.addFolder(folderName);
        for (const key of Object.keys(obj)) {
            
            const values: any = obj[key];
            if (key.indexOf("Color") > 0) {
                folder.addColor(values, "value").name(key);
            }
            else {
                if (Array.isArray(values)) {
                    folder.add(values, "value", values).name(key);
                }
                else {
                    const name: string = values.name !== undefined ? values.name : key;
                    folder.add(values, "value", values.min, values.max, values.step).name(name);
                }
            }
        }
        if (open) folder.open();
        return folder;
    }
}