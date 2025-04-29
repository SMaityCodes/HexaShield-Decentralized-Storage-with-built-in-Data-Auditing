# THIS IS BOB
cd /home/cherry/Downloads/Demo/Storage || exit
#!/bin/bash
MY_PORT=22224
ALICE_IP="172.29.2.246"
ALICE_PORT=22223

trap "exit" SIGINT
dataAuditPath="/home/cherry/Downloads/Demo/Storage/DataAudit"
echo "Bob.sh script has been triggered!"
date  # Print current date-time

echo "Setting up... Waiting for incoming connections."
while true; do

	# Wait for ChalStr.txt from Alice
	socat - TCP-LISTEN:$MY_PORT,reuseaddr > ChalStr.txt

	# Run ProofGen: takes ChalStr.txt and other necessary files as input and generates POP.bin as output
	"$dataAuditPath" ProofGen Params.bin 15MBData.csv ChalStr.txt

	# Send POP.bin to Alice
	cat POP.bin | socat - TCP:$ALICE_IP:$ALICE_PORT

done

