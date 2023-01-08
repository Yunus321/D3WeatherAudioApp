var currentGlyphValues
var currentGlyph
var soundVolume

function startAudioInterface(glyph,districtDict) {

    if (currentGlyph != glyph.path[0]['__data__']) {
        currentGlyph = glyph.path[0]['__data__']
        districtDict.map(elems => (currentGlyph == elems.features) ? (currentGlyphValues = elems.glyphWeatherDataScaleValues) : (elems))
    }
    soundVolume = 0
    var summedFrequencies = startSound(currentGlyphValues, soundVolume)
    return [currentGlyphValues,summedFrequencies]
}

function calculateNewSoundVolume(cursorPos) {

    var disFromCircleCenter = Math.sqrt((Math.abs(cursorPos[0])**2 + (Math.abs(cursorPos[1])**2)))
    var reduceVolume = glyphRadius
    soundVolume = (glyphRadius - disFromCircleCenter) / reduceVolume
    changeVolume(soundVolume)
}