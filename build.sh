cat \
	src/game.js \
	src/random.js \
	src/renderer.js \
	src/entity.js \
	src/entity-player.js \
	src/entity-cpu.js \
	src/entity-plasma.js \
	src/entity-spider.js \
	src/entity-sentry.js \
	src/entity-particle.js \
	src/entity-dead.js \
	src/entity-health.js \
	src/entity-explosion.js \
	src/sonantx-reduced.js \
	src/music-dark-meat-beat.js \
	src/sound-effects.js \
	src/audio.js \
	src/terminal.js \
	src/main.js \
	> build/glued.js

node shrinkit.js build/glued.js > build/glued.compact.js

./node_modules/uglify-es/bin/uglifyjs build/glued.compact.js \
	--compress --screw-ie8 --mangle toplevel -c --beautify --mangle-props regex='/^_/;' \
	-o build/glued.min.beauty.js

./node_modules/uglify-es/bin/uglifyjs build/glued.compact.js \
	--compress --screw-ie8 --mangle toplevel --mangle-props regex='/^_/;' \
	-o build/exe.min.js


rm build/axship.zip

#sed -e '/GAME_SOURCE/{r build/underrun.min.js' -e 'd}' src/html-template.html > underrun.html
cp src/html-template.html build/index.html
zip -9 build/axship.zip m/q2.png m/l1.png m/l2.png m/l3.png m/l4.png m/l5.png m/l6.png m/l7.png m/l8.png m/l9.png m/l10.png m/l11.png
#ls -la build/
#mv underrun.html build/index.html
