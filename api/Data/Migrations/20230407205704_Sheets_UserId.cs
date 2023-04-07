using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mavanmanen.DndSheet.API.Data.Migrations
{
    public partial class Sheets_UserId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Sheets",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Sheets");
        }
    }
}
