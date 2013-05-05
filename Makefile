PAGES=./index.html

default: $(PAGES)

%.html : %.php
	php `basename $<` > $@

clean : 
	-rm ./index.html
