type Translations = Record<string, any>;

let currentlang : string = "en";

const languages: Record<string, Translations> = {};

export function registerLocale(lang:string, data:Translations){
    languages[lang] = data;
}


export function setLanguage(lang: string){
    if(!languages[lang]){
        throw new Error(`Locale '${lang}' not registered`);
    }

    currentlang = lang;
}

export function t(path: string, vars?: Record<string, string | string>): string {
    const keys = path.split('.');
    let result: any = languages[currentlang];

    for(const key of keys){
        result = result?.[key];
        if(result == null) return path;
    }

    if (typeof result === 'string' && vars){
        for(const [ key, value] of Object.entries(vars) ){
            result = result.replace(`{{${key}}}`, String(value))
        }
    }

    return typeof result === 'string' ? result: path
}