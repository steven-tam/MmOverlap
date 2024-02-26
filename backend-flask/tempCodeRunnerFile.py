
        filtered_item["customFields"] = {key: item["customFields"][key] for key in ['programLevelCareer', 'cdProgramDescr']}  # Filter 'custom' dictionary