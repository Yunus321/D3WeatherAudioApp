
var currentGlyphValues
var currentGlyph
var soundVolume

function startAudioInterface(glyph) {

    if (currentGlyph != glyph.path[0]['__data__']) {
        currentGlyph = glyph.path[0]['__data__']
        for (var i = 0; i < reducedFeatures.length; i++) {
            if(currentGlyph == reducedFeatures[i]) {
                currentGlyphValues = glyphWeatherDataScaleValues[i]
            }
        }
    }
    soundVolume = 0
    startSound(currentGlyphValues, soundVolume)
}

function calculateNewSoundVolume(cursorPos) {

    var disFromCircleCenter = Math.sqrt((Math.abs(cursorPos[0])**2 + (Math.abs(cursorPos[1])**2)))
    var reduceVolume = 10
    soundVolume = (glyphRadius - disFromCircleCenter) / reduceVolume
    changeVolume(soundVolume)
}




