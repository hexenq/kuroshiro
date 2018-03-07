import Kuroshiro from "./core";
import {
    hasHiragana,
    hasKatakana,
    hasKanji,
    isHiragana,
    isKatakana,
    isKanji    
 } from "./util";

var kuroshiro = new Kuroshiro();

kuroshiro.hasHiragana = hasHiragana;
kuroshiro.hasKatakana = hasKatakana;
kuroshiro.hasKanji = hasKanji;
kuroshiro.isHiragana = isHiragana;
kuroshiro.isKatakana = isKatakana;
kuroshiro.isKanji = isKanji;

export default kuroshiro;