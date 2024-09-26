package dump_test

import (
	"testing"

	"github.com/jean-bernard-laguerre/plateforme-safebase/dump"
	"github.com/jean-bernard-laguerre/plateforme-safebase/test/setup"
)

var d = dump.DumpModel{}

func CreateDump(t *testing.T) {
	created, err := d.Create("test", "test", 1)
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}
	if created == 0 {
		t.Fatalf("Create failed")
	}
	setup.IdList["dump"] = created

	result, dumpErr := d.GetById(setup.IdList["dump"])
	if dumpErr != nil {
		t.Fatalf("GetById failed: %v", dumpErr)
	}
	if result.Id != setup.IdList["dump"] {
		t.Fatalf("Create failed")
	}
}

func GetDumpById(t *testing.T) {
	result, err := d.GetById(setup.IdList["dump"])
	if err != nil {
		t.Fatalf("GetById failed: %v", err)
	}
	if result.Id != setup.IdList["dump"] {
		t.Fatalf("GetById failed")
	}
}

func GetAllDumps(t *testing.T) {
	result, err := d.GetAll()
	if err != nil {
		t.Fatalf("GetAll failed: %v", err)
	}
	if len(result) == 0 {
		t.Fatalf("GetAll failed")
	}
}

func UpdateDump(t *testing.T) {
	update, err := d.Update(setup.IdList["dump"], false)
	if err != nil {
		t.Fatalf("Update failed: %v", err)
	}
	if update != true {
		t.Fatalf("Update failed")
	}

	result, dumpErr := d.GetById(setup.IdList["dump"])
	if dumpErr != nil {
		t.Fatalf("GetById failed: %v", dumpErr)
	}

	if result.Active != false {
		t.Fatalf("Update failed")
	}
}
