const Tour = require('./../models/tourmodel');

exports.getAllTours = (req,res) => {
    console.log(req.requestTime);
    
    
    
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        /* results: tours.length,
        data: {
            tours: tours
        } */
    });
};

exports.getTour = (req,res) => {
    const id = req.params.id*1;
    
    /* const tour = tours.find(el=> el.id === id);
    res.status(200).json({
        status: 'success',
        data:{
            tour:tour
        }
    }); */
};

exports.createTour = async (req,res) =>{
try{
    const newTour = await Tour.create(req.body);
 
   res.status(201).json({
    status:'success',
    data:{
        tour:newTour
        }
    });
}catch(err){
    res.status(400).json({
        status:'fail',
        message: err
    });
}
};
  
exports.updateTour = (req,res) =>{
    res.status(200).json({
        status:'success',
        data:{
            tour: '<Updated form here..>'           
        }

    });
};

exports.deleteTour = (req,res) =>{

    res.status(204).json({
        status:'success',
        data: null  
        });
};