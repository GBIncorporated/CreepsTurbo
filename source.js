
let mod = {};
module.exports = mod;

mod.extend = function ()
{
   Source.prototype.GetAccessableFields = function ()
   {
      var fields = this.room.lookForAtArea(LOOK_TERRAIN, this.pos.y - 1, this.pos.x - 1, this.pos.y + 1, this.pos.x + 1, true);
      let walls = _.countBy(fields, "terrain").wall;
      var accessibleFields = walls === undefined ? 9 : 9 - walls;
      return accessibleFields;
   }
};