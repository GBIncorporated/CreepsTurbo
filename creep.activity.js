let Activity = function ()
{
   Object.defineProperties(Activity, {
      name: {
         value: "Unkown",
         writable: true
      },
      renewTarget: {
         value: "Unkown",
         writable: true
      },
      maxPerTarget: {
         value: "Unkown",
         writable: true
      },
      targetRange: {
         value: "Unkown",
         writable: true
      }
   });


   // Esnures this activity is valid.
   Activity.isValidActivity = function (creep)
   {
      return false;
   };

   Activity.isValidTarget = function (target)
   {
      false;
   };

   // picks a new target suitable for this activity
   Activity.newTarget = function (creep)
   {
      return null;
   }
   // Runs this activity.
   Activity.work = function (creep)
   {
      // no work in base class.
   };

   // order for the creep to execute each tick, when assigned to that action
   Activity.step = function (creep)
   {
      let target = creep.GetTarget();
      let range = creep.pos.getRangeTo(target);
      if (range <= this.targetRange) {
         var workResult = this.work(creep);
         if (workResult != OK) {
            creep.SetActivity(null);
            return;
         }
      }
      
      else {
         if (target != null) {
            let error = creep.Drive(target.pos);
         }
      }
   };

};

module.exports = Activity;