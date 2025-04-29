# THIS IS ALICE
# Ensure working directory is correct
cd /home/cherry/Downloads/Demo/Auditor || exit

#!/bin/bash
MY_PORT=22223
BOB_IP="172.29.2.246"
BOB_PORT=22224
counter=1

trap "exit" SIGINT
# Absolute path to DataAudit
dataAuditPath="/home/cherry/Downloads/Demo/Auditor/DataAudit"


while true; do
	echo "Auditing instance $counter"
	
	# Run ChallengeGen: generates ChalStr.txt as output
	"$dataAuditPath" ChallengeGen

	# Send ChalStr.txt to Bob
	cat ChalStr.txt | socat - TCP:$BOB_IP:$BOB_PORT

	# Wait for POP.bin from Bob
	socat - TCP-LISTEN:$MY_PORT,reuseaddr > POP.bin

	# Run VerifyProof: takes POP.bin and other necessary files as input and prints the result
	res=$("$dataAuditPath" VerifyProof Params.bin POP.bin metaData.bin ChalStr.txt)
	if [ $res -eq 1 ]; then
		echo "VERIFICATION SUUCCESSFUL !"
		paplay Success_Msg.ogg
	else
		echo "VERIFICATION FAILED !  DATA IS CORRUPUTED !"
		paplay Failure_msg.ogg
	fi
	
	sleep 1
	counter=$((counter + 1))

done
