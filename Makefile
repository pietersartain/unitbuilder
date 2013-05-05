PAGES=index.html
MAINDIR=content
REALPATH=$(realpath $(MAINDIR))

default: $(addprefix $(REALPATH)/,$(PAGES)) sass

$(REALPATH)/%.html : %.php
	cd `dirname $<`; php `basename $<` > $@

sass:
	compass compile

.PHONY: sass

clean: 
	-rm $(REALPATH)/index.html
	compass clean
