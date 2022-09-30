INTERFACE=interface

all:
	cd .\$(INTERFACE) && make

clean:
	del $(INTERFACE)\*.class *.jar
