let mod = {};

module.exports = mod;

mod.extend = function ()
{
   Creep.prototype.run = function (roleName)
   {
      let roleType = Creep.role[roleName];
      if (roleType != undefined) {
         roleType.run(this);
      }
      else {
         console.log("Got an undefined role! " + roleName);
         // Dead weight reclaim
         // this.suicide();
      }
   }
   Creep.prototype.SetupMemory = function ()
   {
      if (this.memory.data == undefined) {
         this.memory.data = { targetId: "", predictedRenewal: 0, role: {}, activity: {} }
      }
   }

   // Move the creep
   Creep.prototype.Drive = function (pos)
   {
      return this.moveTo(pos.x, pos.y);
   }

   // Memory Get and set
   Creep.prototype.GetRole = function ()
   {
      return Creep.role[this.GetData().role.name];
   }

   Creep.prototype.GetData = function ()
   {
      return this.memory.data;
   }

   Creep.prototype.GetActivity = function ()
   {
      if (this.GetData().activity != null) {
         return Creep.activity[this.GetData().activity.name];
      }
      else return null;
   }

   Creep.prototype.SetActivity = function (value)
   {
      this.memory.data.activity = value;
   }

   Creep.prototype.SetRole = function (value)
   {
      this.memory.data.role = value;
   }

   Creep.prototype.SetData = function (value)
   {
      return this.memory.data = value;
   }

   Creep.prototype.SetTarget = function (value)
   {
      this.memory.data.targetId = value.id;
   }

   Creep.prototype.GetTarget = function ()
   {
      return Game.getObjectById(this.memory.data.targetId);
   }

   // Helper functions
   Creep.prototype.Sum = function ()
   {
      return _.sum(this.carry);
   }
};

mod.execute = function ()
{
   let run = creep => creep.run(creep.GetRole().name);
   _.forEach(Game.creeps, run);
};

