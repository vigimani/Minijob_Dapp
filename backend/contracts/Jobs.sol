// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

///@title A mini Job Smart Contracty
///@author Mavinigi

contract Jobs {

    struct Job {
        address author;
        address worker;
        string description;
        uint price;
        bool isFinished;
    }

    Job[] jobs;

    event jobAdded(address indexed author, string description, uint price, uint id, bool isFinished);
    event jobTaken(address indexed worker, uint id);
    event jobIsFinishedAndPaid(address indexed author, address indexed worker, uint id, uint pricePaid);

    ///@notice Allows to add a new job 
    ///@param _description the complete description of the job
    function addJob(
        string calldata _description
    ) external payable {
        require(msg.value>0, "price input is mandatory and should be positive");
        //require(bytes(_description).length>5, "at least 5 letters you lazy bastard");
        require(jobs.length<1000, "1000 max to avoid ddos");
        Job memory newjob = Job(msg.sender, address(0), _description, msg.value, false);
        jobs.push(newjob);
        emit jobAdded(msg.sender, _description, msg.value, jobs.length-1, false);
    }

    ///@notice Allows to take the job
    ///@param _id the index of the job in the jobs array
    function takeJob(uint _id) external {
        require(jobs.length >= _id , "no job with this id");
        require(msg.sender != jobs[_id].author, "author cannot take its own job");
        require(jobs[_id].worker == address(0), "job already taken");
        jobs[_id].worker = msg.sender;
        emit jobTaken(msg.sender, _id);
    }

    ///@notice Allows to end the job and to pay the worker
    ///@param _id the id of the job in the jobs array
    function setIsFinishedAndPay(uint _id) external {
        require(jobs[_id].worker != address(0), "job not taken by a worker");
        require(msg.sender == jobs[_id].author, "only the author can close and pay");
        (bool paid, ) = jobs[_id].worker.call{value : jobs[_id].price}('');
        if (!paid) {
            revert("The worker has not been paid, transaction has been reverted");
        } else {
            jobs[_id].isFinished = true;
            emit jobIsFinishedAndPaid(jobs[_id].author, jobs[_id].worker, _id, jobs[_id].price);
        }
    }
}
