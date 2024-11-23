import type { BiIcon } from "./bootstrap-icons";
import type { CusIcon } from "./custom-icons";


export type IconGroupInfo = {
    folder: string;
    svgFile: (name: string) => string;
};

export type Icon = BiIcon | CusIcon;
export const iconGroups: Record<string, IconGroupInfo>  = {
    'bi': { folder: 'bootstrap-icons', svgFile: (iconName) => `bootstrap-icons.svg#${iconName}` },
    'cus': { folder: 'icons/custom', svgFile: (iconName) => `${iconName}.svg` }
}